# Resume

This directory contains the standalone, ATS-friendly LaTeX resume for Divyum
Bhumra. The website publishes its viewer at `/resume` and serves the PDF from
`/resume/divyum-bhumra-resume.pdf` so visitors can preview or download it.

## Build

The build requires a TeX distribution with `pdflatex`, Poppler (`pdfinfo` and
`pdftoppm`) and the WebP tool `cwebp`.

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

The Resume page also contains a semantic HTML version in
[`app/resume/page.tsx`](../app/resume/page.tsx). When the resume changes, keep
its roles, dates, skills and outcomes aligned with the LaTeX source so
assistive-technology users receive an equivalent text alternative.

The website intentionally presents a two-page resume. If the PDF page count
changes, update the preview image list and its tests in the same change.
