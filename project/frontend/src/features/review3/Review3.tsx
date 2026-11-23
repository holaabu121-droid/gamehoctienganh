import sourceJson from "../../../../data/lessons/review3_source.json";
import {StructuredReview} from "../semester2/StructuredReview";
import type {StructuredReviewSource} from "../semester2/structuredReviewEngine";
export function Review3(){return <StructuredReview source={sourceJson as StructuredReviewSource}/>;}
