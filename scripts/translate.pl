#!/usr/bin/perl
use 5.010;
use strict;
use warnings;

my $argSize = @ARGV;
sub arg{
    my $i = $_[0];
    if ($i >= $argSize){
	die "Arg $i doesn't exist";
    } else {
	return $ARGV[$i];
    }
}

my $root = '/home/ec2-user/webAML/web_server/community/domains';
my $path = $root; 

if ($argSize > 0 ){
my @steps = split('/', arg 0);

if ($steps[0] eq ''){
    shift @steps
}


foreach my $step (@steps) {
    $path .= "/subs/".$step
}}

say "$path";


opendir(DIR, $path.'/aml') or die $!;

while (my $file = readdir(DIR)) {

        # Use a regular expression to find files ending in .aml
    next unless ($file =~ m/\.aml$/);

    my $base = `basename $file .aml`;
    chomp $base;
    my $output = `/home/ec2-user/webAML/web_server/translator/bin/go "$path/aml/$file"`;

    my $letter = substr($output, 0, 1);
    my $rest = substr($output, 1);
    my $xten = '';
    if ($letter eq 'j'){
	$xten ='json';
    } else {
	$xten = 'html';
    }
    my $outfile = "$path/pages/$base.$xten";
   open(my $fh, '>', $outfile) or die "Could not open file '$outfile' $!";
   print $fh $rest;
   close $fh;

}
closedir(DIR);
exit 0;
   
