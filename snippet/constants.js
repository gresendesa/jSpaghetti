const LAST_COMMAND_TERMINATED = "lastCommandTerminated"
const PROCEDURE_RELEASED = "procedureReleased"
const PAGE_IS_ABOUT_TO_RELOAD = "beforeunload"
const SEQUENCE_TERMINATED = "terminated"
const SEQUENCE_RESET = "reset"
const STORAGE_NAME = "\"jSpaghetti:\" + moduleName + \":\" + sequenceName"
const EXIT_COMMAND = "_exit"
const GOTOIF_COMMAND = "gotoif"
const WAIT_COMMAND = "wait"
const WAIT_FOR_THE_SIGNAL_FLAG = "_forTheSignal"
const WAIT_FOR_PAGE_TO_RELOAD = "_forPageToReload"
const INTERNAL_OBJECT_COMMANDS_LIST = [WAIT_COMMAND, GOTOIF_COMMAND]
const DEFAULT_DELAY = 10