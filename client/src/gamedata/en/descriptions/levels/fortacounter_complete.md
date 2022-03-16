This was easy right ? 

The main purpose was to showcase a Forta agent. As you might have seen, if an attacker changes how the monitored smart contract behaves by a bug, it might make the agent to fail into detecting a change in value in a variable, an event being fired etc...

The bug here was quite easy to detect only by reading the code, but an agent might be tricked by an upgrade of a codebase behind a proxy. For those cases you may want to build an agent that detects upgrade events.

To know how to build your own agent and start experimenting with those, go here.