# hypercore encoding benchmark

Given we have some properties in the schema that need to be a generic object type, it seems like the easiest way to get that with a small `byteLength` size is by using protocol buffers.

It looks like adding a 32 byte buffer as a prefix adds almost 12% to the total `byteLength`.

Improvements or suggestions welcome!

Results on m1 macbook air:

```
NANOBENCH version 2
> /Users/sdv/.nvm/versions/node/v16.14.0/bin/node index.js

# json 5000
ok ~220 ms (0 s + 219998875 ns)

json core 5000 byteLength 3665000 


# json stored as buffers 5000
ok ~190 ms (0 s + 190475666 ns)

json buffers 5000 core byteLength 3665000 


# protocol buffers 5000
ok ~178 ms (0 s + 177808584 ns)

protocol buffers 5000 core byteLength 1225000 


# compact encoding 5000
ok ~218 ms (0 s + 218312792 ns)

compact encoding 5000 core byteLength 2635000 

# protocol buffers 5000 with prefix
ok ~140 ms (0 s + 139845750 ns)

protocol buffers 5000 with prefix core byteLength 1385000 

all benchmarks completed
ok ~3.87 s (3 s + 873449000 ns)
```
