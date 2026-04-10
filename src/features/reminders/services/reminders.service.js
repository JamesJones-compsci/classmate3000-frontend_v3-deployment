import { USE_MOCK_API } from "../../../config/env";
import * as realApi from "../../../api/reminders.api";
import * as mockApi from "./reminders.mock";

export const remindersService = USE_MOCK_API ? mockApi : realApi;