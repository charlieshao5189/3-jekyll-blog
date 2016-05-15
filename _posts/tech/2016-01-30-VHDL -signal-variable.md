---
layout: post
title: VHDL signal and variable difference
category: 技术
tags: VHDL
keywords: vhdl, signal,variable
---

1.Signals are used to connect the design components and must carry the information between current statements of the design. On the other hand, variables are used within process to compute certain values.Variables must be declared inside a process
2. A variable changes instantaneously when the variable assignment is executed. On the other hand, a signal changes a delay after the assignment expression is evaluated. If no delay is specified, the signal will change after a delta delay. This has important consequences for the updated values of variables and signals. 
-------------------------------------------------------------
below are the example in which a process is used to calculate the signal RESULT .

Example of a process using Variables

```
architecture VAR of EXAMPLE is
signal TRIGGER, RESULT: integer := 0; 
begin
process
variable variable1: integer :=1;
variable variable2: integer :=2;
variable variable3: integer :=3;
begin
wait on TRIGGER;
variable1 := variable2;
variable2 := variable1 + variable3;
variable3 := variable2;
RESULT <= variable1 + variable2 + variable3;
end process;
end VAR
```
-------------------------------------------------------------
Example of a process using Signals

```
architecture SIGN of EXAMPLE is
signal TRIGGER, RESULT: integer := 0; 
signal signal1: integer :=1;
signal signal2: integer :=2;
signal signal3: integer :=3;
begin
process 
begin
wait on TRIGGER;
signal1 <= signal2;
signal2 <= signal1 + signal3;
signal3 <= signal2;
RESULT <= signal1 + signal2 + signal3;
end process;
end SIGN;
```
-------------------------------------------------------------------
In the first case, the variables “variable1, variable2 and variable3” are computed sequentially and their values updated instantaneously after the TRIGGER signal arrives. Next, the RESULT is computed using the new values of the variables. This results in the following values (after a time TRIGGER): variable1 = 2, variable2 = 5 (=2+3), variable3= 5. Since RESULT is a signal it will be computed at the time TRIGGER and updated at the time TRIGGER + Delta. Its value will be RESULT=12.

On the other hand, in the second example, the signals will be computed at the time TRIGGER. All of these signals are computed at the same time, using the old values of signal1, 2 and 3. All the signals will be updated at Delta time after the TRIGGER has arrived. Thus the signals will have these values: signal1= 2, signal2= 4 (=1+3), signal3=2 and RESULT=7.
