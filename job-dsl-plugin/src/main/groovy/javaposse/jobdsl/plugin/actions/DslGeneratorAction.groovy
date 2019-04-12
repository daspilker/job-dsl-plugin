package javaposse.jobdsl.plugin.actions

import hudson.model.Action
import hudson.model.FreeStyleProject
import javaposse.jobdsl.plugin.structs.DescribableHelper
import org.jenkinsci.plugins.structs.describable.ArrayType
import org.jenkinsci.plugins.structs.describable.DescribableModel
import org.jenkinsci.plugins.structs.describable.DescribableParameter
import org.jenkinsci.plugins.structs.describable.ErrorType
import org.jenkinsci.plugins.structs.describable.UninstantiatedDescribable

import static javaposse.jobdsl.plugin.structs.DescribableHelper.uncapitalize

class DslGeneratorAction implements Action {
    private static final Set<String> IGNORED_ARGUMENTS = ['name', 'parent']
    private static final Map<String, String> RENAMED_ARGUMENTS = [
            blockBuildWhenDownstreamBuilding: 'blockOnDownstreamProjects',
            blockBuildWhenUpstreamBuilding: 'blockOnUpstreamProjects',
            triggersList: 'triggers',
            allProperties: 'properties',
            assignedNode: 'label',
            scmCheckoutRetryCount: 'checkoutRetryCount',
            buildWrappersList: 'wrappers',
            buildersList: 'steps',
            publishersList: 'publishers',
    ]
    private static final Set<String> OTHER_ARGUMENTS = [
            'jdk', 'customWorkspace', 'scm', 'disabled', 'quietPeriod', 'keepDependencies', 'concurrentBuild',
            'description', 'displayName'
    ]

    final String iconFileName = '/plugin/job-dsl/images/48x48/print.png'
    final String displayName = 'Generate Job DSL'
    final String urlName = 'generate-job-dsl'

    final FreeStyleProject target

    DslGeneratorAction(FreeStyleProject target) {
        this.target = target
    }

    String getScript() {
        UninstantiatedDescribable describable = UninstantiatedDescribable.from(target)
        Map<String, ?> arguments = describable.arguments
        arguments.remove('name')
        arguments.remove('parent')

        StringBuilder builder = new StringBuilder()
        builder << "freeStyleJob('${target.fullName}') {\n"
        generateContext(builder, describable.model, adjustFreeStyleProjectArguments(arguments, builder), 2)
        builder << '}\n'
        builder
    }

    private static Map<String, Object> adjustFreeStyleProjectArguments(Map<String, ?> arguments, StringBuilder builder) {
        Map<String, Object> result = [:]
        for (Map.Entry<String, ?> argument : arguments.entrySet()) {
            if (IGNORED_ARGUMENTS.contains(argument.key)) {
                continue
            }
            if (RENAMED_ARGUMENTS.containsKey(argument.key)) {
                result[RENAMED_ARGUMENTS[argument.key]] = argument.value
                continue
            }
            if (OTHER_ARGUMENTS.contains(argument.key)) {
                result[argument.key] = argument.value
                continue
            }
            builder << '  // ERROR: do not know how to handle '
            builder << argument.key
            builder << '\n'
        }
        result
    }

    private static void generateContext(StringBuilder builder, UninstantiatedDescribable describable, int indent) {
        builder << ' ' * indent
        builder << (describable.symbol ?: uncapitalize(describable.model.type))
        builder << ' {\n'
        generateContext(builder, describable.model, describable.arguments, indent + 2)
        builder << ' ' * indent
        builder << '}\n'
    }

    private static void generateContext(StringBuilder builder, DescribableModel<?> model, Map<String, ?> arguments,
                                        int indent) {
        for (Map.Entry<String, ?> argument : arguments.entrySet()) {
            DescribableParameter parameter = model.getParameter(argument.key)
            builder << ' ' * indent
            if (parameter) {
                builder << argument.key
                generateValue(builder, parameter, argument.value, indent)
            } else {
                builder << 'ERROR: do not know how to handle '
                builder << argument.key
            }
            builder << '\n'
        }
    }

    private static void generateValue(StringBuilder builder, DescribableParameter parameter, Object value, int indent) {
        if (DescribableHelper.isContextParameter(parameter.type)) {
            builder << ' {\n'
            if (parameter.type instanceof ArrayType) {
                value.each {
                    generateContext(builder, (UninstantiatedDescribable) it, indent + 2)
                }
            } else {
                generateContext(builder, (UninstantiatedDescribable) value, indent + 2)
            }
            builder << ' ' * indent
            builder << '}'
        } else if (parameter.type instanceof ArrayType) {
            ArrayType arrayType = (ArrayType) parameter.type
            if (arrayType.elementType instanceof ErrorType) {
                generateError(builder, (ErrorType) arrayType.elementType)
            } else {
                builder << '[\n'
                value.each {
                    builder << ' ' * (indent + 2)
                    generateValue(builder, it)
                    builder << ',\n'
                }
                builder << ' ' * indent
                builder << ']'
            }
        } else if (parameter.type instanceof ErrorType) {
            generateError(builder, (ErrorType) parameter.type)
        } else {
            builder << '('
            generateValue(builder, value)
            builder << ')'
        }
    }

    private static void generateValue(StringBuilder builder, Object value) {
        if (value instanceof String) {
            generateQuote(builder, value)
            builder << value.replace('\\', '\\\\').replace("'", "\\'")
            generateQuote(builder, value)
        } else {
            builder << value
        }
    }

    private static void generateQuote(StringBuilder builder, String value) {
        builder << (value.contains('\n') || value.contains('\r') ? "'''" : "'")
    }

    private static void generateError(StringBuilder builder, ErrorType errorType) {
        builder << '() // ERROR: '
        builder << errorType.error.message
    }
}
