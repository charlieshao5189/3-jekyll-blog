---
layout: post
title: VHDL FSM - mearly and moore outputs
category: 技术
tags: VHDL
keywords: vhdl,fsm, mearly, moore, outputs
---

FSM component: state register, next-state logic and output logic.

Moore machine: the output is only a function of state. 

Mealy machine: the output is a function of state and external input.

![state diagram and ASM chart](https://raw.githubusercontent.com/charlieshao5189/charlieshao5189.github.io/master/assets/pics/stateDiagram.png)

```VHDL
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity fsm is
    Port ( clk : in  STD_LOGIC;
           rst : in  STD_LOGIC;
           a : in  STD_LOGIC;
           b : in  STD_LOGIC;
           y0 : out  STD_LOGIC;
           y1 : out  STD_LOGIC);
end fsm;

architecture Behavioral of fsm is

type eg_state_type is (s0,s1,s2);
signal state_reg,state_next:eg_state_type;


begin
--state register update
process(clk, rst)
begin
	if(rst='1')then
		state_reg<=s0;
	elsif clk'event and clk='1' then
		state_reg<=state_next;
	end if;
end process;

-- next-state logic and output logic codes are sepreated

----next state logic
--process(state_reg,a,b)
--begin
--	case state_reg is
--		when s0=>
--		  if a='1' then
--			  if b='1' then
--					state_next<=s2;
--				else 
--		         state_next<=s1;
--				end if;
--		  else
--		     state_next<=s0;
--		  end if;
--		when s1=>
--			if a='1' then
--				state_next<=s0;
--			else
--			   state_next<=s1;
--			end if;
--		when s2=>
--				state_next<=s0;
--	end case;
--end process; 
----moore output logic
--process(state_reg)
--begin
--case state_reg is 
--	when s0|s1=>
--		y1<='1';
--	when s2=>
--		y1<='0';
--end case;
--end process;
----mealy output logic
--process(state_reg,a,b)
--	begin
--		case state_reg is
--			when s0=>
--				if a='1' and b='1' then
--					y0<='1';
--				else
--					y0<='0';
--				end if;
--			when s1|s2=>
--				y0<='0';
--		end case;
--end process;


-- next-state logic and output logic codes are merged into a signal combinational block

--next state logic
process(state_reg,a,b)
begin
	state_next<=state_reg;--default back to the same state;
	y0<='0';--default 0
	y1<='0';--default 0
	case state_reg is
		when s0=>
			y1<='1';
		  if a='1' then
			  if b='1' then
					y0<='1';
					state_next<=s2;
				else 
		         state_next<=s1;
				end if;
		--no else branch
		  end if;
		when s1=>
		   y1<='1';
			if a='1' then
				state_next<=s0;
		--no else branch
			end if;
		when s2=>
				state_next<=s0;
	end case;
end process; 

end Behavioral;
```
