import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GITHUB_STRATEGY_NAME } from "../constants";

@Injectable()
export class Github extends AuthGuard(GITHUB_STRATEGY_NAME) {}
