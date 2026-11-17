import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sources and credits" };

const refs = [
  {
    cite: "Touretzky, D., Gardner-McCune, C., Martin, F., & Seehorn, D. (2019). Envisioning AI for K-12: What should every child know about AI? Proceedings of the AAAI Conference on Artificial Intelligence, 33(1), 9795-9799.",
    url: "https://ai4k12.org",
    used: "Course structure, Five Big Ideas",
  },
  {
    cite: "Computer Science Teachers Association. (2017). CSTA K-12 Computer Science Standards, Revised 2017.",
    url: "https://csteachers.org/k12standards/",
    used: "Standards alignment",
  },
  {
    cite: "LeCun, Y., Cortes, C., & Burges, C. J. C. The MNIST database of handwritten digits.",
    url: "https://yann.lecun.com/exdb/mnist/",
    used: "Unit 1, image size example",
  },
  {
    cite: "Zeiler, M. D., & Fergus, R. (2014). Visualizing and understanding convolutional networks. European Conference on Computer Vision, 818-833.",
    url: "https://arxiv.org/abs/1311.2901",
    used: "Unit 1, learned first-layer kernels",
  },
  {
    cite: "Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). A formal basis for the heuristic determination of minimum cost paths. IEEE Transactions on Systems Science and Cybernetics, 4(2), 100-107.",
    url: "https://doi.org/10.1109/TSSC.1968.300136",
    used: "Unit 2, A* search",
  },
  {
    cite: "Cover, T., & Hart, P. (1967). Nearest neighbor pattern classification. IEEE Transactions on Information Theory, 13(1), 21-27.",
    url: "https://doi.org/10.1109/TIT.1967.1053964",
    used: "Unit 3, k-nearest neighbors",
  },
  {
    cite: "Jurafsky, D., & Martin, J. H. Speech and Language Processing (3rd ed. draft), Chapter 3: N-gram Language Models.",
    url: "https://web.stanford.edu/~jurafsky/slp3/",
    used: "Unit 4, bigram probabilities",
  },
  {
    cite: "Buolamwini, J., & Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. Proceedings of Machine Learning Research, 81, 77-91.",
    url: "https://proceedings.mlr.press/v81/buolamwini18a.html",
    used: "Unit 5, error rates by group",
  },
  {
    cite: "Hardt, M., Price, E., & Srebro, N. (2016). Equality of opportunity in supervised learning. Advances in Neural Information Processing Systems 29.",
    url: "https://arxiv.org/abs/1610.02413",
    used: "Unit 5, equal opportunity",
  },
  {
    cite: "Kleinberg, J., Mullainathan, S., & Raghavan, M. (2016). Inherent trade-offs in the fair determination of risk scores. arXiv:1609.05807.",
    url: "https://arxiv.org/abs/1609.05807",
    used: "Unit 5, conflicting metrics",
  },
  {
    cite: "Chouldechova, A. (2017). Fair prediction with disparate impact: A study of bias in recidivism prediction instruments. Big Data, 5(2), 153-163. Preprint 2016.",
    url: "https://arxiv.org/abs/1610.07524",
    used: "Unit 5, conflicting metrics",
  },
];

export default function SourcesPage() {
  return (
    <>
      <p className="eyebrow">Reference</p>
      <h1>Sources and credits</h1>
      <p className="lede">Facts, dates, and figures on this site come from the works below.</p>

      <section className="section">
        <h2 style={{ marginBottom: 12 }}>Works cited</h2>
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th className="hide-sm">Used in</th>
              </tr>
            </thead>
            <tbody>
              {refs.map((r) => (
                <tr key={r.url}>
                  <td>
                    {r.cite}{" "}
                    <a href={r.url} className="small" target="_blank" rel="noreferrer">
                      Link
                    </a>
                  </td>
                  <td className="small muted hide-sm" style={{ whiteSpace: "nowrap" }}>
                    {r.used}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginBottom: 12 }}>Data and media</h2>
        <div className="panel panel-pad prose stack">
          <p>
            All lab data is generated in the browser. The loan applicants in Unit 5 and the points in Unit 3 are simulated
            with a fixed random seed. The Unit 4 training text was written for this site.
          </p>
          <p>The site uses no stock photos, icons, or third-party images.</p>
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginBottom: 12 }}>Software</h2>
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>License</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Next.js and React</td>
                <td className="muted">MIT</td>
              </tr>
              <tr>
                <td>IBM Plex Sans and IBM Plex Mono, via Google Fonts</td>
                <td className="muted">SIL Open Font License 1.1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
