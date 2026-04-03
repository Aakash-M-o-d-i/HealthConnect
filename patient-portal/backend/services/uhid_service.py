import random


def generate_uhid():
    """Generate a unique Universal Health ID."""
    chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    part1 = ''.join(random.choices(chars, k=4))
    part2 = ''.join(random.choices(chars, k=4))
    return f"HID-{part1}-{part2}"
