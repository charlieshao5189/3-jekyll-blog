---
layout: post
title: 教科书级别的VHDL代码之灯控有限状态机 
category: 技术
tags: VHDL
keywords: VHDL
---

## 灯控有限状态机描述:

Design a finite state machine that controls a lighting circuit.

The FSM has two control inputs - DAY and MANUAL, and two outputs - LIGHT and RED

The DAY input is from a sensor that indicates whether it is daytime (DAY =' 1') or nighttime (DAY='0').

The MANUAL signal comes from a switch that sets if LIGHT is controlled by the sensor (MANUAL='0') or if it is lit independently of the sensor (MANUAL='1') - Manual mode.

The LIGHT output turns on the light during the night or when MANUAL='1'. Otherwise, the light is off - LIGHT = '0'.

The RED output lights a red signaling lamp when MANUAL is active (RED= '1').Otherwise, RED='0'.

Design and simulate your FSM so that the light turns on every nights (DAY='0') or when MANUAL='1'. Use a Moore machine.



This is one possible solution for our problem!
In this case, the problem is solved using three states – IDLE, M_ON and S_ON.
Note: !MANUAL means NOT MANUAL or MANUAL =’0’; !DAY means NOT DAY or DAY=’0’

![lightFSM](https://raw.githubusercontent.com/charlieshao5189/charlieshao5189.github.io/master/assets/pics/lightFSM.png)

In the IDLE state, LIGHT is off and the red SIGNAL is also off.

If MANUAL is switched on, then we go to state M_ON. In this state, LIGHT is on and theRED is also on, signalling that we are in MANUAL mode.

If MANUAL is switched off, then if during the day (DAY=’1’) we return to the IDLE state, or go to the S_ON if during the night. In the latter case, light stills on but the RED goes off, signalling that we left the Manual mode.

If MANUAL is switched off, we leave the IDLE state by nightfall and go to the S_ON state. The light is lit. If the manual switch is activated in the meanwhile, we go to the M_ON state and the RED goes on. Otherwise, at daybreak we return to the IDLE state.


### VHDL代码：


```VHDL

library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity control is
    Port ( clk : in STD_LOGIC;		-- clk signal input
			  reset : in STD_LOGIC;		-- FSM reset
			  DAY : in  STD_LOGIC;		-- sensor's input
           MANUAL : in  STD_LOGIC;  -- manual control input
           LIGHT : out  STD_LOGIC;	-- light
           RED : out  STD_LOGIC);	-- warning signal
end control;

architecture Behavioral of control is

-- FSM state names				
type state_type is (IDLE, S_ON, M_ON);      -- state names - IDLE - light is disable, manual control is disable
														  -- S_ON - sensor activates the light - manual control is off
														  -- M_ON - manual control is on

-- signals
signal state_reg, state_next : state_type;  -- current and next state 			
				      
begin

-- state register

process (clk, reset)

begin

	if (reset='1') then
		state_reg <= IDLE;
	elsif (clk'event and clk='1') then		-- update state at the 
			state_reg <= state_next;			-- rising edge of the clock
	end if;
	
end process;

-- next-state/output logic

process (state_reg, DAY, MANUAL)		-- determine the next state
												-- when the current state
												-- or the inputs change
begin
	
	case state_reg is						-- FSM description
	
		when IDLE =>						-- in the IDLE state -> daytime and manual mode is off
		
			LIGHT <= '0';					-- light is off
			RED <= '0';						-- warning signal is off
		
			If (MANUAL = '0' and DAY = '1') then   -- daytime and manual is disable
							
				state_next <= IDLE;						-- remains in the IDLE state -> light and warning signal off
				
			elsif MANUAL = '1' then						-- MANUAL switch is enabled
			
				state_next <= M_ON;						-- changes to manual mode
				
			else
			
				state_next <= S_ON;						-- night falls => changes to nighttime -> light is on
				
			end if;
				
		when S_ON =>						-- in the S_ON state -> night time and manual mode off		
		
			LIGHT <= '1';					-- light is switched on automatically
			RED <= '0';						-- warning signal is off
		
			If (MANUAL = '0' and DAY = '1') then   -- sun rises and manual is disable
							
				state_next <= IDLE;						-- goes to the IDLE state
				
			elsif MANUAL = '1' then						-- manual switch is enabled
			
				state_next <= M_ON;						-- goes to the M_ON state
				
			else
			
				state_next <= S_ON;						-- nighttime
				
			end if;
			
		when M_ON =>							-- in the M_ON state daytime and manual mode on
		
			LIGHT <= '1';						-- light is on manual mode
			RED <= '1';							-- red signal is on
		
			If (MANUAL = '0' and DAY = '1') then    -- daytime and manual is disabled
							
				state_next <= IDLE;						 -- goes to the IDLE state
				
			elsif MANUAL = '1' then					    -- MANUAL switch is enabled
			
				state_next <= M_ON;						 -- remains on the M_ON state
				
			else
			
				state_next <= S_ON;							-- night falls and manual is disabled -> goes to S_ON state
				
			end if;
		

	end case;					-- end of the FSM description
	
end process;

end Behavioral;


```

### Simulation代码：


```VHDL

LIBRARY ieee;
USE ieee.std_logic_1164.ALL;
 
ENTITY control_tb IS
END control_tb;
 
ARCHITECTURE behavior OF control_tb IS 
 
    -- Component Declaration for the Unit Under Test (UUT)
 
    COMPONENT control
    PORT(
         clk : IN  std_logic;
			reset : IN std_logic;
         DAY : IN  std_logic;
         MANUAL : IN  std_logic;
         LIGHT : OUT  std_logic;
         RED : OUT  std_logic
        );
    END COMPONENT;
    

   --Inputs
   signal clk : std_logic := '0';      
	signal reset : std_logic := '1';		-- initialized in the IDLE state
   signal DAY : std_logic := '1';		-- daytime automatic
   signal MANUAL : std_logic := '0';

 	--Outputs
   signal LIGHT : std_logic;				
   signal RED : std_logic;

   -- Clock period definitions
   constant clk_period : time := 10 ns;
	
	
BEGIN
 
	-- Instantiate the Unit Under Test (UUT)
   uut: control PORT MAP (
          clk => clk,
			 reset => reset,
          DAY => DAY,
          MANUAL => MANUAL,
          LIGHT => LIGHT,
          RED => RED
        );

   -- Clock generation
   clk_process :process
   begin
		clk <= '0';
		wait for clk_period/2;
		clk <= '1';
		wait for clk_period/2;
   end process;
 

   -- Stimulus process
   stim_proc: process
   begin		
      -- hold reset state for 100 ns.
      wait for 100 ns;	

      wait for clk_period*10;

      -- insert stimulus here 
		
		reset <= '0';			-- disable reset
		
		MANUAL <= '1';			-- activate manual mode while in daytime
		DAY <= '1';				
		wait for 105 ns;
		
		MANUAL <= '1';			-- night falls
		DAY <= '0';				
		wait for 105 ns;
		
		MANUAL <= '0';			-- disable manual mode while in night time
		DAY <= '0';				
		wait for 105 ns;
		
		MANUAL <= '0';			-- sun rises
		DAY <= '1';				
		wait for 105 ns;
		
		MANUAL <= '0';			-- night falls
		DAY <= '0';				
		wait for 105 ns;
		
		MANUAL <= '1';			-- activate manual mode while in night time
		DAY <= '0';				
		wait for 105 ns;
		
		MANUAL <= '0';			-- disable manual mode when sun rises
		DAY <= '1';				
		wait for 105 ns;
		
		wait;
		
   end process;

END;


```


### Tip1:
All sequential statements are within the PROCESS block. Or in other word, all statements within PROCESS are sequential.
IF THEN, CASE and FOR LOOP三种声明方式只能用在顺序结构中，即process中，参考[More VHDL Constructs](http://web.engr.oregonstate.edu/~sllu/vhdl/lec2f.html)。

### Tip2:

```
  process (state_reg, DAY, MANUAL)		-- determine the next state
```
Process executes when there is an event on one of the signals on its sensitivity list causing events to occurs on signals that it assigns to. 

