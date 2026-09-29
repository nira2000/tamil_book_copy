from pathlib import Path

BOOK_FOLDER = Path(".")

changed = 0
skipped = 0

for html_file in BOOK_FOLDER.rglob("*.html"):

    if html_file.name.lower() == "index.html":
        skipped += 1
        continue

    content = html_file.read_text(encoding="utf-8")

    # Don't add the protection twice
    if "pin-protection.js" in content:
        print(f"Already protected: {html_file}")
        continue

    # Find the opening <body> tag
    body_position = content.lower().find("<body")

    if body_position == -1:
        print(f"SKIPPED - no <body> tag: {html_file}")
        continue

    body_end = content.find(">", body_position)

    if body_end == -1:
        print(f"SKIPPED - invalid <body> tag: {html_file}")
        continue

    # Work out the correct path to pin-protection.js
    relative_path = html_file.relative_to(BOOK_FOLDER)
    depth = len(relative_path.parts) - 1

    if depth == 0:
        script_path = "pin-protection.js"
    else:
        script_path = "../" * depth + "pin-protection.js"

    script_tag = f'<script src="{script_path}"></script>'

    # Add the protection script immediately after <body>
    new_content = (
        content[:body_end + 1]
        + "\n\n"
        + script_tag
        + "\n"
        + content[body_end + 1:]
    )

    html_file.write_text(new_content, encoding="utf-8")

    changed += 1
    print(f"Protected: {html_file}")

print()
print("=" * 50)
print("FINISHED!")
print(f"HTML files protected: {changed}")
print(f"HTML files skipped: {skipped}")
print("=" * 50)