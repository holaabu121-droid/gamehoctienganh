import sourceJson from "../../../../data/lessons/unit11_source.json";
import {StructuredUnit} from "../semester2/StructuredUnit";
import type {StructuredUnitSource} from "../semester2/structuredUnitEngine";
export function Unit11(){return <StructuredUnit source={sourceJson as StructuredUnitSource}/>;}
