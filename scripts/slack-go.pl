#!/usr/local/bin/perl
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
my $translatorRoot = '/home/brenan/AML-Translator';
my $root = '/home/brenan/community_site';
my $path = $root.'/domains'; 

if ($argSize > 0 ){
my @steps = split('/', arg 0);

if ($steps[0] eq ''){
    shift @steps
}


foreach my $step (@steps) {
    $path .= "/subs/".$step
}}

say $path;

