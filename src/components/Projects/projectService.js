
export async function getAllProjects(props) {
    let data = [];
    await Promise.resolve(
        props.project.methods.getProjectIds().call().then((result) => {
            result.map((projectId) => {
                props.project.methods
                    .getProjectInfo(projectId)
                    .call()
                    .then((result) => {
                        const project = {
                            index: result['index'],
                            name: result['name'],
                            description: result['description'],
                            status: result['projectStatus'],
                            ipfsFileCID: result['ipfsFileCID'],
                        };
                        data.push(project);
                    });
                return true;
            });
        })
    );
    return data;
}
