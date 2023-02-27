"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const logs_1 = require("./logs");
const upload_1 = require("./upload");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const log_file = core.getInput('log_file');
            const separator = core.getInput('log_separator');
            const loki_url = core.getInput('loki_url');
            const loki_org_id = core.getInput('loki_org_id');
            const loki_username = core.getInput('loki_username');
            const loki_password = core.getInput('loki_password');
            const raw_loki_labels = core.getInput('loki_labels');
            const loki_labels = {};
            for (const raw_label of raw_loki_labels.split(',')) {
                const [key, value] = raw_label.split('=');
                loki_labels[key] = value;
            }
            const entries = (0, logs_1.parse_logs)(log_file, separator);
            if (entries.error) {
                core.setFailed(entries.error);
                return;
            }
            yield (0, upload_1.upload)(entries, loki_url, loki_org_id, loki_username, loki_password, loki_labels);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
