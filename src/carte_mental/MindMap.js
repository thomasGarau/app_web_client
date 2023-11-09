// MindMap.jsx
import React, { useEffect } from 'react';
import { DataSet, Network } from 'vis';

const MindMap = () => {
  useEffect(() => {
    // Les données du graphe
    const nodes = new DataSet([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
    ]);

    const edges = new DataSet([
      { from: 1, to: 2 },
    ]);

    // Configuration du graphe
    const options = {};

    // Création du réseau
    const container = document.getElementById('mindmap');
    const data = { nodes, edges };
    const network = new Network(container, data, options);

    return () => {
      // Nettoyez le réseau lors du démontage du composant
      network.destroy();
    };
  }, []); // Assurez-vous de déclencher useEffect une seule fois

  return <div id="mindmap" style={{ height: '600px' }}></div>;
};

export default MindMap;
