import { USE_MOCK_API } from "../../../config/env";
import * as realApi from "../../../api/tasks.api";
import * as mockApi from "./tasks.mock";

export const tasksService = USE_MOCK_API ? mockApi : realApi;