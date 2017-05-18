#translator='/home/ec2-user/webAML/Community'
translator=$2
for file in $1/aml/*.aml
do
    base=`basename $file .aml`
    $translator/bin/go "$file" > $1/pages/"$base".json
done
