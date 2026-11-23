import sourceJson from "../../../../data/lessons/unit12_source.json";
import {StructuredUnit} from "../semester2/StructuredUnit";
import type {StructuredUnitSource} from "../semester2/structuredUnitEngine";

export function Unit12(){return <StructuredUnit source={sourceJson as StructuredUnitSource}/>;}
