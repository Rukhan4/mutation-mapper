def parse_mutation_file(file):
    mutations = []
    for line in file:
        if isinstance(line, bytes):
            line = line.decode("utf-8")
        if line.startswith("#") or line.strip() == "":
            continue
        parts = line.strip().split("\t")
        if len(parts) >= 4:
            gene = parts[2]
            mutation = parts[3]
            mutations.append({"gene": gene, "mutation": mutation})
    return mutations
