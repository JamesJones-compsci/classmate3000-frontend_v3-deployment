import { USE_MOCK_API } from "../../../config/env";
import * as realApi from "../../../api/progress.api";
import * as mockApi from "./progress.mock";

export const progressService = USE_MOCK_API ? mockApi : realApi;