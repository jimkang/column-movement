# column-movement

Simple script for analyzing how things move from one column in a csv to another column in a csv.

## Installing

Clone, then `npm i`.

## Usage

Put two csv files in `data/` that have this format:

    Header 1,Header 2,Header 3
    some value,other value,new value
    Great value,greater value,greatest value

Optionally, edit out the anonymization if you don't want the values anonymized.

Run `node analyze.js your-first.csv your-second.csv <optional seed used in anonymizing the values>`.

You'll get output that looks like this:

    {
      New Header A:
        HEADER 3: [ 'vHnxm', 'kbbTN', 'bvhox', 'qOJGg', 'fhGBz' ],
        HEADER 2: [ 'UlJhF', 'yFMvL', 'Awqyh', 'FsUzJ', 'pHkGJ', 'tLzOb' ],
        undefined: [ 'HQPMN', 'FbGlL', 'NdxfD', 'MxZGw', 'rehAA' ],
        HEADER 4: [ 'AUeFP', 'EWpgu', 'rbLcS', 'YQGtR', 'vvUKe', 'ZLrOY' ]
      },
      New Header B: {
        HEADER 3: [ 'QonHI', 'ZSNVU', 'DiRDK', 'VEgcR', 'iBlFn' ],
        HEADER 2: [
          'iOOCa', 'xePKX',
          'LFNEm', 'nnMUm',
          'BkbtN', 'HvPGT',
          'acOiV'
        ],
        undefined: [ 'rTuEm', 'POcnf', 'NrWAr', 'gKywH', 'DCRNM' ],
        HEADER 4: [ 'KJUlS', 'VjVqA', 'mxiTU', 'lHFrp', 'dJJBH' ]
      }
    }

This tells you that in the new csv, the values `'vHnxm', 'kbbTN', 'bvhox', 'qOJGg', 'fhGBz'` which are now in the `New Header A` column all came from the `HEADER 3` column in the old csv.
