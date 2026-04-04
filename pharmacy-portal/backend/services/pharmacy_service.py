import random


def generate_transaction_id():
    """Generate a unique transaction ID for dispensed prescriptions."""
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return 'TXN' + ''.join(random.choices(chars, k=8))
