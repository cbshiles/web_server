for file in $1/aml/*.aml
do
    base=`basename $file .aml`
    output=$(./translator/bin/go "$file")
    if [[ $output == j* ]]
    then 
	echo "${output:1:${#output}-1}" > $1/pages/"$base".json
    else
	echo "${output:1:${#output}-1}" > $1/pages/"$base".html
    fi
done
