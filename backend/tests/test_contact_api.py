"""Backend API tests for IT SMARTCLOUT contact endpoints."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://web-from-github.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ------- Health -------
class TestHealth:
    def test_root_returns_service_and_status(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("service") == "IT SMARTCLOUT API"
        assert data.get("status") == "ok"


# ------- Contact create -------
class TestContactCreate:
    def test_create_contact_ok(self, client):
        marker = f"TEST_{uuid.uuid4().hex[:8]}"
        payload = {
            "name": f"{marker} Tester",
            "email": f"tester+{marker.lower()}@example.com",
            "company": marker,
            "message": "Please reach out about our datacenter migration.",
            "lang": "pl",
        }
        r = client.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["name"] == payload["name"]
        assert body["email"] == payload["email"].lower()
        assert body["company"] == payload["company"]
        assert body["message"] == payload["message"]
        assert body["lang"] == "pl"
        assert isinstance(body["id"], str) and len(body["id"]) > 0
        assert "created_at" in body

        # verify persistence via GET
        list_r = client.get(f"{API}/contact?limit=500")
        assert list_r.status_code == 200
        ids = [x["id"] for x in list_r.json()]
        assert body["id"] in ids

    def test_create_contact_lowercases_email_and_trims(self, client):
        marker = f"TEST_{uuid.uuid4().hex[:8]}"
        payload = {
            "name": f"  {marker}  ",
            "email": f"  MIXED+{marker}@Example.COM  ",
            "message": "  hello  ",
            "lang": "en",
        }
        r = client.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == payload["email"].strip().lower()
        assert body["name"] == payload["name"].strip()
        assert body["message"] == "hello"
        assert body["lang"] == "en"

    def test_create_contact_invalid_email_rejected(self, client):
        payload = {
            "name": "TEST invalid",
            "email": "not-an-email",
            "message": "hello",
        }
        r = client.post(f"{API}/contact", json=payload)
        assert 400 <= r.status_code < 500, r.text
        # FastAPI/Pydantic uses 422 for validation
        assert r.status_code == 422

    def test_create_contact_missing_required_fields(self, client):
        # missing message
        r = client.post(f"{API}/contact", json={"name": "TEST", "email": "a@b.com"})
        assert r.status_code == 422

    def test_create_contact_empty_name_rejected(self, client):
        r = client.post(
            f"{API}/contact",
            json={"name": "", "email": "a@b.com", "message": "hi"},
        )
        assert r.status_code == 422


# ------- Contact list -------
class TestContactList:
    def test_list_contacts_returns_array(self, client):
        r = client.get(f"{API}/contact")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        if data:
            first = data[0]
            for k in ("id", "name", "email", "message", "created_at"):
                assert k in first
            # Ensure Mongo _id is not leaked
            assert "_id" not in first

    def test_list_contacts_respects_limit(self, client):
        # create at least one
        client.post(
            f"{API}/contact",
            json={
                "name": "TEST list limit",
                "email": f"listlimit-{uuid.uuid4().hex[:6]}@example.com",
                "message": "limit test",
            },
        )
        r = client.get(f"{API}/contact?limit=1")
        assert r.status_code == 200
        assert len(r.json()) <= 1
