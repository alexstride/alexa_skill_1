#! /bin/zsh
rm index.zip
cd src
zip -r -X ../index *
cd ..
/Users/alexanderstride/Library/Python/3.6/bin/aws lambda update-function-code --function-name numberMemory --zip-file fileb://index.zip
