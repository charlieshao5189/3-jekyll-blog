---
layout: post
title:  problems of Xilinx ISE Installing on Ubuntu 
category: 技术
tags: VHDL
keywords: Xilinx ISE, Ubuntu
---
For the new semester, we will learn FPGA and VHDL more deeply. I try to install Adaptet and ISE174. 

## 1. Programming Nexy 3 Board on Ubuntu through Adept

* Step 1 - Run ```djtgcfg enum```, output should be as follows;

```
$ djtgcfg enum
Found 1 device(s)

Device: Nexys3
    Product Name:   Nexys3
    User Name:      Nexys3
    Serial Number:  210182454903
``` 

* Step 2 - Run ```sudo djtgcfg init -d  *UserName*```, output should be as follows;

```
$sudo djtgcfg init -d  Nexys3
Initializing scan chain...
Found Device ID: 44002093

Found 1 device(s):
    Device 0: XC6SLX16
``` 

* Step 3 - Run ```djtgcfg prog -d *UserName* -i *Device Number* -f *FileName*```, output should be as follows;

```
$ djtgcfg prog -d Nexys3 -i 0 -f filename.bit 
Programming device. Do not touch your board. This may take a few minutes...
Programming succeeded.
``` 

