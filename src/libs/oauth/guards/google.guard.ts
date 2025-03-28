import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GOOGLE_STRATEGY_NAME } from "../constants";

@Injectable()
export class Google extends AuthGuard(GOOGLE_STRATEGY_NAME) {}
