---
layout: post
title: VHDL Snegitivity List, Combinatorial and Synchronous 
category: 技术
tags: VHDL
keywords: vhdl,Snegitivity list, Combinatorial,Synchronous 
---

# VHDL Snegitivity List, Combinatorial and Synchronous 

If a signal is in the sensitivity list of a process, the process will "wake up" and be evaluated whenever the value of that signal changes. If it is not in the sensitivity list, a signal can change, but a process will not be re-evaluated to determine what the new outputs should be.

### For Combinatorial Logic: 
Likely you want all your input signals to be included in the sensitivity list. If they are not included in the sensitivity list, then that will result in your output not changing even when that input signal changes. This is a common error (due to carelessness). Note that in VHDL 2008 you can use "all" keyword to automatically include all necessary signals in your process and avoid creating latches.

### For Synchronous Logic: 
Likely you only want your clock (and maybe your reset) signal in the sensitivity list. This is because you are only concerned with the value of your signals (other than the clock) when your system clock has changed. This is because you are typically describing registers (composed of flip flops) which only allow changing their output value on a clock edge.

All of this can be confusing in the case of using HDL for synthesis because only a subset of the circuits you describe in VHDL can actually be implemented within a FPGA. For example, you can't have a primitive memory element that is sensitive to two independent clock edges, even though you could describe such a circuit by including two clocks in a sensitivity list.
