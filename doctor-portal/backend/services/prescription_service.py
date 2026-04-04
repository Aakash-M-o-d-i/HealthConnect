import random


def generate_rx_code():
    """Generate a unique prescription RX code."""
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return 'RX' + ''.join(random.choices(chars, k=6))
