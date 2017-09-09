#!/usr/bin/perl
use strict;
use warnings;

#eval this in bashrc

#This file contains the list of all directories to be added to path, one per line.
my $filename = "/home/ec2-user/webAML/web_server/scripts/testpath";
    open(my $fh, '<:encoding(UTF-8)', $filename)
    or die "Could not open file '$filename' $!";

my $pathAdd = '';
     
while (my $row = <$fh>) {
    chomp $row;
    $pathAdd .= ":$row";
}

print 'export PATH='.$ENV{'PATH'}.$pathAdd;

