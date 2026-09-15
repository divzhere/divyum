# Resume

This directory contains the standalone, ATS-friendly LaTeX resume for Divyum
Bhumra. The website serves a copy from `public/resume/` so visitors can preview
or download it from the Resume page.

## Build

From the repository root, run:

```bash
pdflatex -interaction=nonstopmode -halt-on-error \
  -output-directory=resume resume/divyum-bhumra-resume.tex
cp resume/divyum-bhumra-resume.pdf public/resume/divyum-bhumra-resume.pdf
test "$(pdfinfo resume/divyum-bhumra-resume.pdf | awk '/^Pages:/ { print $2 }')" -eq 2
preview_dir=$(mktemp -d)
pdftoppm -r 150 -png resume/divyum-bhumra-resume.pdf "$preview_dir/page"
cwebp -quiet -q 86 -m 6 "$preview_dir/page-1.png" \
  -o public/resume/divyum-bhumra-resume-page-1.webp
cwebp -quiet -q 86 -m 6 "$preview_dir/page-2.png" \
  -o public/resume/divyum-bhumra-resume-page-2.webp
```

Run the command twice if cross-references or links are changed. The generated
PDF, its public copy and the two page previews are committed alongside the
source so the resume can be viewed or downloaded without a local TeX
installation.

The website intentionally presents a two-page resume. If the PDF page count
changes, update the preview image list and its tests in the same change.
