package javaposse.jobdsl.plugin

import hudson.model.Item

import java.nio.file.NoSuchFileException
import java.util.logging.Logger

import static hudson.Util.getDigestOf
import static hudson.model.Items.getConfigFile
import static java.util.logging.Level.WARNING

class DigestHelper {
    private static final Logger LOGGER = Logger.getLogger(DigestHelper.name)

    static String digest(Item item) {
        File configFile = getConfigFile(item).file

        int retries = 0
        while (true) {
            try {
                return getDigestOf(configFile)
            } catch (NoSuchFileException | FileNotFoundException e) {
                retries += 1
                if (retries == 3) {
                    throw e
                }
                LOGGER.log(WARNING, "Could not compute digest for ${configFile.absolutePath}, retrying", e)
                Thread.sleep(retries * 10)
            }
        }
    }
}
