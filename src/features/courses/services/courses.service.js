import { USE_MOCK_API } from "../../../config/env";
import * as realApi from "../../../api/courses.api";
import * as mockApi from "./courses.mock";

export const coursesService = USE_MOCK_API ? mockApi : realApi;