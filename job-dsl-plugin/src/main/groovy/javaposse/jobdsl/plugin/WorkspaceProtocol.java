package javaposse.jobdsl.plugin;

import hudson.FilePath;
import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import jenkins.model.Jenkins;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;

public class WorkspaceProtocol {
    /**
     * Create a workspace URL that represents the base dir of the given AbstractProject.
     */
    public static URL createWorkspaceUrl(AbstractProject project) throws MalformedURLException, UnsupportedEncodingException {
        String jobName = project.getFullName();
        String encodedJobName = URLEncoder.encode(jobName, "UTF-8");
        return new URL(null, "workspace://" + encodedJobName+ "/", new WorkspaceUrlHandler());
    }

    /**
     * Create a workspace URL that represents the given FilePath.
     */
    public static URL createWorkspaceUrl(AbstractBuild build, FilePath filePath) throws IOException, InterruptedException {
        String relativePath = filePath.getRemote().substring(build.getWorkspace().getRemote().length());
        relativePath = relativePath.replaceAll("\\\\", "/"); // normalize for Windows
        String slash = filePath.isDirectory() ? "/" : "";
        return new URL(createWorkspaceUrl(build.getProject()), relativePath + slash, new WorkspaceUrlHandler());
    }

    /**
     * Parse the AbstractProject from the given workspace URL representation.
     */
    public static AbstractProject getProjectFromWorkspaceUrl(URL url) throws UnsupportedEncodingException {
        Jenkins jenkins = Jenkins.getInstance();
        if (jenkins == null) {
            throw new IllegalStateException("Not in a running Jenkins");
        }

        String jobName = url.getHost();
        String decodedJobName = URLDecoder.decode(jobName, "UTF-8");
        return (AbstractProject) jenkins.getItemByFullName(decodedJobName);
    }

    /**
     * Parse the FilePath from the given workspace URL representation.
     */
    public static FilePath getFilePathFromUrl(URL url) throws UnsupportedEncodingException {
        AbstractProject project = getProjectFromWorkspaceUrl(url);
        FilePath workspace = project.getSomeWorkspace();
        String relativePath = url.getFile().substring(1); // remove leading slash
        return workspace.child(relativePath);
    }
}
