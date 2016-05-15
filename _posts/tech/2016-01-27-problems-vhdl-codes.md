---
layout: post
title: VHDL codes problem:gated clock and flip-flop& latche
category: 技术
tags: VHDL
keywords: vhdl,problem
---

# 1 avoid gated clock 
If we had divided the clock and applied the result directly to the register, we would have received a gated clock warning, because the clock applied to the register was not the system clock but the a signal obtained from some logic used to divided it. 
It's better to avoid gated clock in VHDL codes.Don't use divided clock signal, use system clock and enable signal to update register.like:```if clk'event and clk = '1' and en ='1' then```. "en" comes from the divided clock signal.

### disadvantages of gated clock
Using gated clocks can cause undesirable effects such as false/double clocking, missed clocking, non-uniform clocking, and/or undesired clock skew in the design, resulting in unpredictable and unreliable behaviour. Indeed, depending on the clock level, when the load signal is activated the output of the register may be updated, independently of the system clock, causing an asynchronous signal to be propagated through the system.

# 2 use flip-flops instead of latches
Always update your registers when a rising edge of the system clock occurs, using the construction 

```VHDL
prprocess(clk, reset, ....)
  begin
      if (reset=‘1’) then
          your_registers <= ‘0’;
      elsif(clk’event and clk=‘1’) then
          your_registers <= new_values;
      end if;
end process;
```







