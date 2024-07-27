find . -name '.DS_Store' -type f -ls -delete
zip -r archives/`date +"%Y%m%d-%H%M%S"`.zip ./ -x '*tmp*' '*archives*'
