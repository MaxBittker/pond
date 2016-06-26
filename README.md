 # pond
neural network controlled creatures, evolving in a predator-prey environment.
see it in action at https://maxbittker.github.io/pond/


======================================

This is a simulation of agents living inside an environment where they compete for food. Each creature moves through it's surroundings by using it's own simple neural "brain" to make decisions about which direction to move based on a simple set of inputs or "senses" about its immediate surroundings.

The creatures are ranked by their fitness (quantity of food found), and the most successful creatures are colored most brightly. Periodically the worst performing creatures are removed while the best performers are given offspring whose brain wirings are based on their parents', plus a random set of mutations.

Over time, these random mutations coupled with the selection process result in creatures that are increasingly adept at navigating their surroundings and securing food. If you leave this page running for a couple hundred generations, you'll be able to observe the results. This process is analogous to the natural phenomenon of evolution.

If you're interested in seeing more artificial evolution experiments like this one, I recommend checking out creatures avoiding planks or the 1996 research project/game Darwin Pond.
