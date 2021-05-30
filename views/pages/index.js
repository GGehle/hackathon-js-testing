import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {React , useEffect , useState } from 'react'
import * as React from 'react';
import Web3 from 'web3'
import { ForceGraphInstance as ForceGraphKapsuleInstance } from 'force-graph';

export interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

export type NodeObject = object & {
  id?: string | number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
};

export type LinkObject = object & {
  source?: string | number | NodeObject;
  target?: string | number | NodeObject;
};

type Accessor<In, Out> = Out | string | ((obj: In) => Out);
type NodeAccessor<T> = Accessor<NodeObject, T>;
type LinkAccessor<T> = Accessor<LinkObject, T>;

type CanvasCustomRenderMode = 'replace' | 'before' | 'after';
type CanvasCustomRenderFn<T> = (obj: T, canvasContext: CanvasRenderingContext2D, globalScale: number) => void;
type CanvasPointerAreaPaintFn<T> = (obj: T, paintColor: string, canvasContext: CanvasRenderingContext2D, globalScale: number) => void;

type DagMode = 'td' | 'bu' | 'lr' | 'rl' | 'radialout' | 'radialin';

interface ForceFn {
  (alpha: number): void;
  initialize?: (nodes: NodeObject[]) => void;
  [key: string]: any;
}

export interface ForceGraphProps {
  // Data input
  graphData?: GraphData;
  nodeId?: string;
  linkSource?: string;
  linkTarget?: string;

  // Container layout
  width?: number;
  height?: number;
  backgroundColor?: string;

  // Node styling
  nodeRelSize?: number;
  nodeVal?: NodeAccessor<number>;
  nodeLabel?: NodeAccessor<string>;
  nodeVisibility?: NodeAccessor<boolean>;
  nodeColor?: NodeAccessor<string>;
  nodeAutoColorBy?: NodeAccessor<string | null>;
  nodeCanvasObjectMode?: string | ((obj: NodeObject) => CanvasCustomRenderMode);
  nodeCanvasObject?: CanvasCustomRenderFn<NodeObject>;
  nodePointerAreaPaint?: CanvasPointerAreaPaintFn<NodeObject>;

  // Link styling
  linkLabel?: LinkAccessor<string>;
  linkVisibility?: LinkAccessor<boolean>;
  linkColor?: LinkAccessor<string>;
  linkAutoColorBy?: LinkAccessor<string | null>;
  linkLineDash?: LinkAccessor<number[] | null>;
  linkWidth?: LinkAccessor<number>;
  linkCurvature?: LinkAccessor<number>;
  linkCanvasObject?: CanvasCustomRenderFn<LinkObject>;
  linkCanvasObjectMode?: string | ((obj: LinkObject) => CanvasCustomRenderMode);
  linkDirectionalArrowLength?: LinkAccessor<number>;
  linkDirectionalArrowColor?: LinkAccessor<string>;
  linkDirectionalArrowRelPos?: LinkAccessor<number>;
  linkDirectionalParticles?: LinkAccessor<number>;
  linkDirectionalParticleSpeed?: LinkAccessor<number>;
  linkDirectionalParticleWidth?: LinkAccessor<number>;
  linkDirectionalParticleColor?: LinkAccessor<string>;
  linkPointerAreaPaint?: CanvasPointerAreaPaintFn<LinkObject>;

  // Render control
  autoPauseRedraw?: boolean;
  minZoom?: number;
  maxZoom?: number;
  onRenderFramePre?: (canvasContext: CanvasRenderingContext2D, globalScale: number) => void;
  onRenderFramePost?: (canvasContext: CanvasRenderingContext2D, globalScale: number) => void;

  // Force engine (d3-force) configuration
  dagMode?: DagMode;
  dagLevelDistance?: number | null;
  dagNodeFilter?: (node: NodeObject) => boolean;
  onDagError?: ((loopNodeIds: (string | number)[]) => void) | undefined;
  d3AlphaMin?: number;
  d3AlphaDecay?: number;
  d3VelocityDecay?: number;
  ngraphPhysics?: object;
  warmupTicks?: number;
  cooldownTicks?: number;
  cooldownTime?: number;
  onEngineTick?: () => void;
  onEngineStop?: () => void;

  // Interaction
  onNodeClick?: (node: NodeObject, event: MouseEvent) => void;
  onNodeRightClick?: (node: NodeObject, event: MouseEvent) => void;
  onNodeHover?: (node: NodeObject | null, previousNode: NodeObject | null) => void;
  onNodeDrag?: (node: NodeObject, translate: { x: number, y: number }) => void;
  onNodeDragEnd?: (node: NodeObject, translate: { x: number, y: number }) => void;
  onLinkClick?: (link: LinkObject, event: MouseEvent) => void;
  onLinkRightClick?: (link: LinkObject, event: MouseEvent) => void;
  onLinkHover?: (link: LinkObject | null, previousLink: LinkObject | null) => void;
  linkHoverPrecision?: number;
  onBackgroundClick?: (event: MouseEvent) => void;
  onBackgroundRightClick?: (event: MouseEvent) => void;
  onZoom?: (transform: {k: number, x: number, y: number}) => void;
  onZoomEnd?: (transform: {k: number, x: number, y: number}) => void;
  enableNodeDrag?: boolean;
  enableZoomInteraction?: boolean;
  enablePanInteraction?: boolean;
  enablePointerInteraction?: boolean;
}

export interface ForceGraphMethods {
  // Link styling
  emitParticle(link: LinkObject): ForceGraphKapsuleInstance;

  // Force engine (d3-force) configuration
  d3Force(forceName: 'link' | 'charge' | 'center' | string): ForceFn | undefined;
  d3Force(forceName: 'link' | 'charge' | 'center' | string, forceFn: ForceFn): ForceGraphKapsuleInstance;
  d3ReheatSimulation(): ForceGraphKapsuleInstance;

  // Render control
  pauseAnimation(): ForceGraphKapsuleInstance;
  resumeAnimation(): ForceGraphKapsuleInstance;
  centerAt(): {x: number, y: number};
  centerAt(x?: number, y?: number, durationMs?: number): ForceGraphKapsuleInstance;
  zoom(): number;
  zoom(scale: number, durationMs?: number): ForceGraphKapsuleInstance;
  zoomToFit(durationMs?: number, padding?: number, nodeFilter?: (node: NodeObject) => boolean): ForceGraphKapsuleInstance;

  // Utility
  getGraphBbox(nodeFilter?: (node: NodeObject) => boolean): { x: [number, number], y: [number, number] };
  screen2GraphCoords(x: number, y: number): { x: number, y: number };
  graph2ScreenCoords(x: number, y: number): { x: number, y: number };
}

type FCwithRef<P = {}, R = {}> = React.FunctionComponent<P & { ref?: React.MutableRefObject<R | undefined> }>;

declare const ForceGraph: FCwithRef<ForceGraphProps, ForceGraphMethods>;

export default ForceGraph;

export default function Home() {
  const [accounts, setAccounts] = useState()

  let web3 =  new Web3()
  const ethEnabled = async () => {

    if (typeof window.ethereum !== 'undefined') {
      // Instance web3 with the provided information from the MetaMask provider information
       web3 = new Web3(window.ethereum);
      try {
        // Request account access
        await window.ethereum.enable();
        window.ethereum.on('accountsChanged', function (accounts) {
          console.log('accountsChanges',accounts);
    
        });
    
         // detect Network account change
        window.ethereum.on('networkChanged', function(networkId){
          console.log('networkChanged',networkId);
        });

        return true
      } catch (e) {
        // User denied access
        return false
      }

    }

    return false;
  }


  const onClickConnect = async () => {

    if (await !ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    }

    var accs = await web3.eth.getAccounts();
    console.log(accs)
    setAccounts(accs[0])


   

  }
 
  
  return (
    <div className={styles.container}>
      <Head>
        <title>VideoNFTs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={onClickConnect}> Connect </button>
        <h1 className={styles.title}>
          Welcome to VideoNFTs !
        </h1>

        

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>{accounts}</h3>
            <p>Your wallet address </p>
          </a>

          
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '} Fleek
        </a>
      </footer>
    </div>
  )
}
