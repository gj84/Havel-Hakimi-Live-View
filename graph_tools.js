function create_n_nodes(sequence) {
  let el = [];
  let nodes = sequence.length;
  for (let i = 0; i < sequence.length; i++) {
    let node = { // node a
        data: {
          id: "n"+(i+1).toString(),
          degree: sequence[i],
          noden: i,
        }
      };//
    el.push(node);
  }
  return el;
}

function create_edge(source, target){
      let edge = { // edge ab
      data: {
        id: source + target,
        source: source,
        target: target
        }
      }
      return edge;
}

function get_nodes_keys(el){
    let nodes_id = [];
    for (let i = 0; i < el.length; i++){
        nodes_id.push(el[i]["data"]["id"]);
    }
    return nodes_id;
}

function distribute_edges(nodes,edges){
  //todo: on sequences like 4,3,3,2,2,1,1 get a not connected graph
  if (nodes.length == 0){
    return edges;
  }
  else {
    nodes.sort(function(i, j){return j[1]-i[1]});
    let x = 1;
    while (nodes[0][1] > 0){

      if (nodes[x][1] > 0) {
        nodes[0][1] -= 1;
        nodes[x][1] -= 1;
        edges.push([nodes[0][0],nodes[x][0]]);
      }
      x++;
    }
    nodes.shift();
    return distribute_edges(nodes,edges);
  }
}

function create_graph(sequence){
  let n = sequence.length;
  let names = [];
  for (let i = 0; i < n; i++) {
    names.push(["n"+(i+1),sequence[i]]);
  };
  let nedges = sequence.reduce(function(a, b) {return a + b;});
}

function random_color() {
    let letters = '79AC';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 4)];
    }
    return color;
}

function draw_graph(sequence) {
  //console.log(create_graph(sequence));
  let nodenames = [];
  for (let i = 0; i < sequence.length; i++) {
    nodenames.push("n"+(i+1));
  };

  let nodes_degree = nodenames.map(function(el,i){return [nodenames[i],sequence[i]]});

  nodes_degree.sort(function(i, j){return j[1]-i[1]});
  let edges = distribute_edges(nodes_degree,[]);


  let el = create_n_nodes(sequence);

  let nodeskeys = get_nodes_keys(el);
  for (let i = 0; i < edges.length; i++) {
    let cn1 = edges[i][0];
    let cn2 = edges[i][1];
    el.push(create_edge(cn1,cn2));
  };

  let cy = cytoscape({
      container: $('#cy'),
      elements: el,


    style: [
      {
        selector: 'node',
        style: {
          'font-size': '.8em',
          'label': 'data(id)',
          'text-valign': "center",
          'text-margin-x' : '3px',
          'text-margin-y' : '3px',
          "width":"1.5em",
          "height":"1.5em",
          'color': '#151515',
          'border-width' : "1px",
          'border-style' : "solid",
          'border-color' : "#111111",
          //'width':'label',
          //"height":"label",
          "background-color": random_color,
          "events": "yes",
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 4,
          //'line-color': '#ccc',
          'selection-box-color': '#ccc',
          'line-color': '#ccd9ff'
        }
      }
    ],

    layout:
    {
      name: 'cose',
      ready: function(){},
      stop: function(){},
      animate: true,
      animationThreshold: 250,
      refresh: 20,
      fit: true,
      padding: 30,
      boundingBox: undefined,
      componentSpacing: 100,
      nodeRepulsion: function( node ){ return 400000; },
      nodeOverlap: 10,
      idealEdgeLength: function( edge ){ return 10; },
      edgeElasticity: function( edge ){ return 100; },
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0,
      useMultitasking: true
    }
  });

  cy.on('mouseover', 'node', function(event) {

      let node = event.cyTarget;
      let noden = node.data("noden");
      node.connectedEdges().css("line-color","#e6e600");

      $("#table > tr:first > td:nth-child("+(noden+2)+")").addClass("tdhighlighted");

      node.qtip({
           content: function () {return node.data("degree")},
           show: {
              event: event.type,
              ready: true
           },
           hide: {
              event: 'mouseout unfocus'
           },
          style: {
              classes: 'qtip-bootstrap',
              tip: {
                'font-size': "1em",
                width: 4,
                height: 4
              }
          }
      }, event);
  });

  cy.on('mouseout', 'node', function(event) {
    let node = event.cyTarget;
    let noden = node.data("noden");
    $("#table > tr:first > td:nth-child("+(noden+2)+")").removeClass("tdhighlighted");
    node.connectedEdges().css('line-color','#ccd9ff');
  });
}
