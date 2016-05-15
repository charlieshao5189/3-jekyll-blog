---
layout: post
title: 教科书级别的VHDL代码之自加减计数器 
category: 技术
tags: VHDL
keywords: VHDL
---

## 自加减计数器:

### VHDL代码：


```VHDL

library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity counter is
    Port ( clk : in  STD_LOGIC;									   -- clk signal input
           direction : in  STD_LOGIC;								-- one input to control the counter direction
           count_out : out  STD_LOGIC_VECTOR (7 downto 0)); -- counter outputs to drive the LEDs
end counter;

architecture Behavioral of counter is

signal count_int : std_logic_vector(7 downto 0) := (others => '0');		-- register with the counter value to be 
																								-- displayed by the LEDs - initialized to 0

 signal clkdiv  : std_logic_vector (23 downto 0) := (others => '0');		-- register to generate an enable signal each
																								-- 0.167(7) seconds with a 100MHz clock  - initialized to 0
																								-- 2^24 bits * 1/(100*10^6) = 0.167(7) seconds

--signal clkdiv  : std_logic_vector (3 downto 0) := (others => '0');   -- the same signal with only 4 bits used 
																								-- during simulation to cut simulation time
																								-- initialized to 0

signal en : std_logic := '0';		   	-- the enable signal will allow the counter to increment or decrement
													-- its current value according to the direction signal - initialized to 0
													-- the counter starts by incrementing its value

begin

process (clk, en)

begin

	if clk'event and clk = '1' then			-- a rising edge of the clock will increment the 24 bits register
	
			clkdiv <= std_logic_vector (signed (clkdiv) + 1);
			
		if clkdiv = x"FFFFFF" then			-- if the content of the register is FFFFFFh, then
		--if clkdiv = "1111" then				-- the same comparison with only 4 bits to be used during simulation
			
				en <= '1';							-- the enable signal is activated and the counter is incremented or
														-- decremented according to the direction signal
			else
				en <='0';							-- if the content of the register is different from FFFFFFh, then
														-- the enable signal is disable and the counter will not be incremented
			end if;
	end if;
				
	
   if clk'event and clk = '1' and en ='1' then  -- if a rising edge of the clock is detected and the enable signal
																-- is active, then the clock signal is applied to the counter
      
		if direction='1' then   												-- depending on the direction signal
         count_int <= std_logic_vector (signed (count_int) + 1);	-- the counter is incremented
      else
         count_int <= std_logic_vector (signed (count_int) - 1);	-- or decremented
      end if;
		
   end if;
	
end process;
 
count_out <= count_int;									-- the content of the counter is assigned to the outputs
						
end Behavioral;

```

### Simulation代码：


```VHDL
LIBRARY ieee;
USE ieee.std_logic_1164.ALL;

ENTITY counter_tb IS
END counter_tb;
 
ARCHITECTURE behavior OF counter_tb IS 
 
    -- Component Declaration for the Unit Under Test (UUT)
 
    COMPONENT counter
    PORT(
         clk : in  STD_LOGIC;
         direction : in  STD_LOGIC;
         count_out : out  std_logic_vector(7 downto 0)
        );
    END COMPONENT;
    

   --Inputs
   signal clk : std_logic := '0';
   signal direction : std_logic := '1';			-- initialized to 1 - the counter starts by incrementing the value

 	--Outputs
   signal count_out : std_logic_vector(7 downto 0);

   -- Constants
	constant clk_period : time := 10 ns;					-- period for a 100MHz clock


 
BEGIN
 
	-- Instantiate the Unit Under Test (UUT)
   uut: counter PORT MAP (
          clk => clk,
          direction => direction,
          count_out => count_out
        );

   -- Clock process definitions - generates the clock pulses
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
	
   direction <= '0' after 2000 ns;	-- changes the counting direction from increment to 
												-- decrement after 2000ns of simulation time
      wait;
   end process;

END;

```


### Tip1:

```
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

clkdiv <= std_logic_vector (signed (clkdiv) + 1);
```
这里使用了```IEEE.NUMERIC_STD.ALL```来实现clkdiv的递增，而不是采用

```
use IEEE.STD_LOGIC_1164.ALL;
use STD_LOGIC_UNSIGNEDA.ALL;

clkdiv <= clkdiv+1;
```
是因为```STD_LOGIC_UNSIGNEDA.ALL```不再是最新的标准，它是90年代初Synopsys写下的，曾被广泛应用。```IEEE.NUMERIC_STD.ALL```是新的不断在更新的IEEE标准，建议采用。更具体的解释请访问[ numeric_std vs std_logic_unsigned.all](http://www.edaboard.com/thread266288.html)。

### Tip2:

```
   if clk'event and clk = '1' and en ='1' then  -- if a rising edge of the clock is detected and the enable signal
																-- is active, then the clock signal is applied to the counter
```
这里的写法叫做Gated clock,优点是en不经常改变的时候比较节能，缺点是增加了延迟，占用空间使设计变得复杂，详见[What is a Gated clock and how it reduces power consumption?](http://vhdlguru.blogspot.no/2010/04/what-is-gated-clock-and-how-it-reduces.html)。
