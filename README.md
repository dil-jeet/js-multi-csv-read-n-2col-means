# js-csv-read-n-2col-means
JS for reading multi-csv files, and calculating means of 2 columns (namely: Longitude, Latitude)


Notes:
-----

- It's written for specific requirements, so little rigid!
- Minimalistic css,js (so, modern-browsers support only)
- No quoted-values in a row supported yet, (avoided `regex-split` for performance for now)
- Calculating means for 2-columns (number static for now)
- Options for setting column-numbers in csv, top-row(header) skipping
