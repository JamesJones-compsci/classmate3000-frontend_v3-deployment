import { USE_MOCK_AUTH } from "../../../config/env";
import * as mockApi from "./auth.mock";
import * as realApi from "../../../api/auth.api";

export const authService = USE_MOCK_AUTH ? mockApi : realApi;