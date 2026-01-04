// Mail Delivery Robot Simulation
// Based on Eloquent JavaScript - Chapter 7

// Road connections in the village
const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Shop-Town Hall",
];

// Build a graph from the road connections
function buildGraph(edges) {
  let graph = Object.create(null);

  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }

  for (let [from, to] of edges.map((r) => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }

  return graph;
}

const roadGraph = buildGraph(roads);

// Village state class
class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels
        .map((p) => {
          if (p.place != this.place) return p;
          return { place: destination, address: p.address };
        })
        .filter((p) => p.place != p.address);

      return new VillageState(destination, parcels);
    }
  }

  static random(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Object.keys(roadGraph));
      let place;
      do {
        place = randomPick(Object.keys(roadGraph));
      } while (place == address);
      parcels.push({ place, address });
    }
    return new VillageState("Post Office", parcels);
  }
}

// Utility functions
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

// Robot implementations
function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}

const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office",
];

function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}

function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some((w) => w.at == place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}

function goalOrientedRobot({ place, parcels }, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}

// Visual simulation runner
function runRobotSimulation(state, robot, memory = [], robotName = "Robot") {
  console.log("\n" + "=".repeat(60));
  console.log(`🤖 ${robotName} Simulation Starting!`);
  console.log("=".repeat(60));

  console.log("\n📍 Starting Location: " + state.place);
  console.log("\n📦 Parcels to deliver:");
  state.parcels.forEach((p, i) => {
    console.log(`   ${i + 1}. Pick up at: ${p.place} → Deliver to: ${p.address}`);
  });

  console.log("\n" + "-".repeat(60));
  console.log("🚀 Starting delivery route...\n");

  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log("-".repeat(60));
      console.log(`\n✅ All deliveries complete in ${turn} turns!`);
      console.log("=".repeat(60) + "\n");
      return turn;
    }

    let action = robot(state, memory);
    let oldPlace = state.place;
    state = state.move(action.direction);
    memory = action.memory;

    // Count parcels picked up and delivered
    let pickedUp = state.parcels.filter(p => p.place === state.place && oldPlace !== state.place).length;
    let atLocation = state.parcels.filter(p => p.place === state.place).length;

    console.log(`Turn ${turn + 1}: ${oldPlace} → ${action.direction}`);
    console.log(`         📦 Carrying: ${state.parcels.length} parcel(s)`);

    if (atLocation > 0) {
      console.log(`         📬 Parcels here to pick up: ${atLocation}`);
    }
    console.log("");
  }
}

// Compare different robots
function compareRobots(robot1, memory1, name1, robot2, memory2, name2, runs = 100) {
  let total1 = 0, total2 = 0;

  for (let i = 0; i < runs; i++) {
    let state = VillageState.random();
    total1 += countSteps(state, robot1, memory1);
    total2 += countSteps(state, robot2, memory2);
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Robot Comparison Results");
  console.log("=".repeat(60));
  console.log(`${name1}: Average ${(total1 / runs).toFixed(2)} steps`);
  console.log(`${name2}: Average ${(total2 / runs).toFixed(2)} steps`);
  console.log("=".repeat(60) + "\n");
}

function countSteps(state, robot, memory) {
  for (let steps = 0; ; steps++) {
    if (state.parcels.length == 0) return steps;
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}

// Display the village map
function displayMap() {
  console.log("\n" + "=".repeat(60));
  console.log("🗺️  Village Map");
  console.log("=".repeat(60));
  console.log(`
                    [Cabin]
                       |
    [Bob's House]--[Alice's House]--[Post Office]--[Marketplace]
         |                                              |    |
    [Town Hall]--[Daria's House]--[Ernie's House]      |    |
         |                              |               |    |
      [Shop]---------------------[Grete's House]------[Farm]
  `);
  console.log("=".repeat(60) + "\n");
}

// Main simulation
console.log("\n");
console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║          🚚 MAIL DELIVERY ROBOT SIMULATION 🚚              ║");
console.log("╚════════════════════════════════════════════════════════════╝");

displayMap();

// Run simulation with random robot
console.log("\n📌 Test 1: Random Robot (moves randomly)");
let state1 = VillageState.random(3);
runRobotSimulation(state1, randomRobot, undefined, "Random Robot");

// Run simulation with route robot
console.log("\n📌 Test 2: Route Robot (follows a fixed mail route)");
let state2 = VillageState.random(3);
runRobotSimulation(state2, routeRobot, [], "Route Robot");

// Run simulation with goal-oriented robot
console.log("\n📌 Test 3: Goal-Oriented Robot (uses pathfinding)");
let state3 = VillageState.random(3);
runRobotSimulation(state3, goalOrientedRobot, [], "Goal-Oriented Robot");

// Compare robots
console.log("\n📌 Test 4: Comparing Robots (100 deliveries each)");
compareRobots(routeRobot, [], "Route Robot", goalOrientedRobot, [], "Goal-Oriented Robot", 100);

console.log("🎉 Simulation complete! Run again for different results.\n");
