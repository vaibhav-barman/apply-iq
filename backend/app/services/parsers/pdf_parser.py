import fitz  # PyMuPDF
from typing import Tuple, IO

def extract_text_from_pdf(file_stream: IO[bytes]) -> Tuple[str, int]:
    """
    Extracts text from a PDF file stream using PyMuPDF.
    Returns a tuple of (extracted_text, page_count).
    """
    try:
        doc = fitz.open(stream=file_stream.read(), filetype="pdf")
    except Exception as e:
        raise ValueError("Invalid or corrupted PDF file.")

    if doc.needs_pass:
        raise ValueError("PDF is password protected and cannot be parsed.")

    page_count = len(doc)
    extracted_parts = []

    for page_num in range(page_count):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        if text:
            extracted_parts.append(text)

    doc.close()
    
    full_text = "\n\n".join(extracted_parts).strip()
    return full_text, page_count
