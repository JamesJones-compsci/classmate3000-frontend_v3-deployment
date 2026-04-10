import { USE_MOCK_API } from "../../../config/env";
import * as mockApi from "./profile.mock";

export const profileService = USE_MOCK_API
  ? mockApi
  : mockApi;