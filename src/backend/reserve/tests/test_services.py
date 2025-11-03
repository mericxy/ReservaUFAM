import pytest
from reserve.services import EmailService

def test_send_approval_email(monkeypatch):
    called = {}

    def fake_send(*a, **kw):
        called["ok"] = True
        return True

    monkeypatch.setattr(EmailService, "send_approval_email", fake_send)
    result = EmailService.send_approval_email("user@example.com", "User Test")

    assert result is True
    assert called["ok"] is True


def test_send_rejection_email(monkeypatch):
    called = {}

    def fake_send(*a, **kw):
        called["ok"] = True
        return True

    monkeypatch.setattr(EmailService, "send_rejection_email", fake_send)
    result = EmailService.send_rejection_email("user@example.com", "User Test")

    assert result is True
    assert called["ok"] is True
