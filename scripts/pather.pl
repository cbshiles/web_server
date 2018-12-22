#!/usr/local/bin/perl
use strict;
use warnings;

use Cwd 'abs_path';
my $dir =  abs_path($0);

#eval this in bashrc

#This file contains the list of all directories to be added to path, one per line.
my $filename = $dir."/testpath";
    open(my $fh, '<:encoding(UTF-8)', $filename)
    or die "Could not open file '$filename' $!";

my $pathAdd = '';
     
while (my $row = <$fh>) {
    chomp $row;
    $pathAdd .= ":$row";
}

print 'export PATH='.$ENV{'PATH'}.$pathAdd;

