"""Hello unit test module."""

from helix.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello helix"
